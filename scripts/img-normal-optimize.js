const { promisify } = require('util');
const path = require('path');
const fse = require('fs-extra');
const sharp = require('sharp');
const mkdirp = require('mkdirp-promise');
const async = require('async');
const glob = require('glob');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

// у некоторых почему то не работает process.env.PWD
if (!process.env.PWD) {
    process.env.PWD = process.cwd();
}

const pathToImagesFolder = `${process.env.PWD}/static/images-normal`;
const pathToOptimizedImagesFolder = `${process.env.PWD}/static/images-normal-optimized`;

const globPromise = promisify(glob);

const customSharp = (inputFile, dimensions) => {
    if (dimensions) {
        const { width = null, height = null } = dimensions;

        return sharp(inputFile).resize(width, height);
    }

    return sharp(inputFile);
};

const resizeImages = async () => {
    try {
        // Взять из папки все файлы, включая подпапки
        const filenames = await globPromise(
            `${pathToImagesFolder}/**/*.{png,jpg,webp}`,
            {
                nodir: true
            }
        );

        const filenamesSplitted = filenames.map(item => {
            const type = path.extname(item);
            const typeWithoutDot = type.split('.').join('');
            const filename = path.basename(item, type);

            return { type: typeWithoutDot, filename, fullPath: item };
        });

        // Очищаем папку
        await fse.remove(pathToOptimizedImagesFolder);

        await async.each(
            filenamesSplitted,
            ({ filename, type, fullPath }, passOver) => {
                const configure = (fileType, dimensions) => {
                    return new Promise((resolve2, reject2) => {
                        const inputFile = fullPath;

                        // Превращаем full path в массив чтобы потом достать инлекс слэша images и взять все что после него и до названия файлы
                        const fullPathToArray = fullPath.split('/');
                        const findImagesSlashIdx = fullPathToArray.findIndex(
                            item => item === 'images-normal'
                        );
                        const nestedDirectories = fullPathToArray
                            .slice(
                                findImagesSlashIdx + 1,
                                fullPathToArray.length - 1
                            )
                            .join('/');

                        // Создает папку с номером ширины и подпапкой если есть
                        const directory = dimensions
                            ? dimensions.width
                            : 'normal';
                        const newDirectory = `${pathToOptimizedImagesFolder}/${directory}/${nestedDirectories}`;
                        const outputFile = `${newDirectory}/${filename}.${fileType}`;

                        mkdirp(newDirectory)
                            .then(() => {
                                if (fileType === 'png') {
                                    customSharp(inputFile, dimensions)
                                        .toFile(outputFile)
                                        .then(async () => {
                                            try {
                                                await imagemin([outputFile], {
                                                    // насчет path.dirname взял отсюда - https://stackoverflow.com/questions/53416803/overwriting-files-in-node-server
                                                    destination: path.dirname(
                                                        outputFile
                                                    ),
                                                    plugins: [
                                                        imageminPngquant({
                                                            quality: [0.6, 0.8]
                                                        })
                                                    ]
                                                });

                                                resolve2();
                                            } catch (err) {
                                                reject2(err);
                                            }
                                        })
                                        .catch(err => reject2(err));

                                    return;
                                }

                                if (fileType === 'webp') {
                                    customSharp(inputFile, dimensions)
                                        .webp({
                                            quality: 90
                                        })
                                        .toFile(outputFile)
                                        .then(() => resolve2())
                                        .catch(err => reject2(err));

                                    return;
                                }

                                customSharp(inputFile, dimensions)
                                    .toFile(outputFile)
                                    .then(() => resolve2())
                                    .catch(err => reject2(err));
                            })
                            .catch(err => reject2(err));
                    });
                };

                const allConfigured = [
                    configure(type),
                    configure('webp'),
                    configure(type, {
                        width: 100
                    }),
                    configure('webp', {
                        width: 100
                    }),
                    configure(type, {
                        width: 360
                    }),
                    configure('webp', {
                        width: 360
                    }),
                    configure(type, {
                        width: 720
                    }),
                    configure('webp', {
                        width: 720
                    })
                ];

                Promise.all(allConfigured)
                    .then(() => {
                        passOver();
                    })
                    .catch(err => {
                        passOver(err);
                    });
            }
        );

        console.log('Все файлы загружены');
    } catch (err) {
        console.log(err);
    }
};

resizeImages();
