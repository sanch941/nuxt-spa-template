const { promisify } = require('util');
const path = require('path');
const fse = require('fs-extra');
const sharp = require('sharp');
const mkdirp = require('mkdirp-promise');
const async = require('async');
const glob = require('glob');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const isDefault = true;

// у некоторых почему то не работает process.env.PWD
if (!process.env.PWD) {
    process.env.PWD = process.cwd();
}

const pathToImagesFolder = `${process.env.PWD}/static/images`;
const pathToOptimizedImagesFolder = `${process.env.PWD}/static/images-opt`;

const globPromise = promisify(glob);

// 1 параметр - ширина, 2 параметр - высота
const sizesDefault = [[1920], [1600], [1366], [1024], [768], [640], [100]];

const sizesOptional = [
    [1920, 1080],
    [1600, 900],
    [1366, 768],
    [1024, 768],
    [768],
    [640],
    [100]
];

const sizes = isDefault ? sizesDefault : sizesOptional;

const resizeImages = async () => {
    try {
        // Взять из папки все файлы, включая подпапки
        const filenames = await globPromise(`${pathToImagesFolder}/**/*`, {
            nodir: true
        });

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
                const resizeImage = (width, height) => {
                    return new Promise((resolve, reject) => {
                        // Убрать мусор из картинки и изменить ее размер

                        // Превращаем full path в массив чтобы потом достать инлекс слэша images и взять все что после него и до названия файлы
                        const fullPathToArray = fullPath.split('/');
                        const findImagesSlashIdx = fullPathToArray.findIndex(
                            item => item === 'images'
                        );
                        const nestedDirectories = fullPathToArray
                            .slice(
                                findImagesSlashIdx + 1,
                                fullPathToArray.length - 1
                            )
                            .join('/');

                        // Создает папку с номером ширины и подпапкой если есть
                        const widthDirectory = `${pathToOptimizedImagesFolder}/${width}/${nestedDirectories}`;

                        const configure = fileType => {
                            return new Promise((resolve2, reject2) => {
                                const inputFile = fullPath;
                                // sharp плохо сжимает png форматы, поэтому приходится менять png на jpg, автор sharp советует использовать Pngquant
                                // но это доп зависимость и еще гора кода

                                const outputFile = `${widthDirectory}/${filename}.${fileType}`;

                                if (fileType === 'png') {
                                    sharp(inputFile)
                                        .resize(width, height)
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
                                    sharp(inputFile)
                                        .resize(width, height)
                                        .webp({
                                            quality: 90
                                        })
                                        .toFile(outputFile)
                                        .then(() => resolve2())
                                        .catch(err => reject2(err));

                                    return;
                                }

                                sharp(inputFile)
                                    .resize(width, height)
                                    .toFile(outputFile)
                                    .then(() => resolve2())
                                    .catch(err => reject2(err));
                            });
                        };

                        mkdirp(widthDirectory).then(() => {
                            // path.extname убирает все что было до точки, оставляя только .jpg, .png. Документация - https://nodejs.org/api/path.html#path_path_extname_path
                            const allConfigured = [
                                configure(type),
                                configure('webp')
                            ];

                            Promise.all(allConfigured)
                                .then(() => {
                                    resolve();
                                })
                                .catch(err => {
                                    reject(err);
                                });
                        });
                    });
                };

                const allResizePromisses = sizes.map(
                    ([width = null, height = null]) =>
                        resizeImage(width, height)
                );

                Promise.all(allResizePromisses)
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
