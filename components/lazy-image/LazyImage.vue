<template>
    <div class="all-full relative overflow-hidden">
        <!-- Порядок загрузки : серый фон => картинка низкого качества => оригинал -->
        <!-- Состояние - серый фон, можно добавить кастомную загрузку если type поменять на custom -->
        <div v-show="!isTinyLoaded" class="all-full absolute-l-t z-20">
            <div v-if="loader === 'default'" class="all-full bg-main-gray" />
            <slot v-else-if="loader === 'custom'" />
        </div>

        <!-- Состояние после загрузки -->
        <!-- invisible это класс tailwind -->
        <div class="all-full relative z-10">
            <img
                :class="[
                    'all-full tiny absolute-l-t object-fit-polyfill',
                    { invisible: isOriginalLoaded }
                ]"
                :src="tinyImgSrc"
                @load="tinyLoaded"
            />

            <picture>
                <source
                    type="image/webp"
                    :class="originalImgClasses"
                    :srcset="originalImgSrcset('webp')"
                    v-bind="otherProps"
                    @load="originalLoaded"
                />
                <source
                    :class="originalImgClasses"
                    :srcset="originalImgSrcset(filetype)"
                    v-bind="otherProps"
                    @load="originalLoaded"
                />
                <img
                    :class="originalImgClasses"
                    :src="originalImgSrc"
                    v-bind="otherProps"
                    @load="originalLoaded"
                />
            </picture>
        </div>
    </div>
</template>

<script>
import { basename } from '../../utils/basename';

export default {
    props: {
        url: {
            type: String,
            required: true
        },
        loader: {
            type: String,
            default: 'default'
        },
        type: {
            type: String,
            default: 'img'
        },
        otherProps: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            isTinyLoaded: false,
            isOriginalLoaded: false
        };
    },
    computed: {
        dev() {
            // process.env.dev указан в nuxt config js, проверяю код на development или продакшн, дополняю еще одну переменную
            // для того чтобы имитировать продакшн
            return !!(process.env.dev && !process.env.fakeProduction);
        },
        isTypeImg() {
            return this.type === 'img';
        },
        sizes() {
            const sizesBg = [320, 720, 1024, 1366, 1600, 1920];
            const sizesNormal = [360, 720, 'normal'];

            return this.isTypeImg ? sizesNormal : sizesBg;
        },
        pathToImg() {
            // иначе взять локальные данные
            if (this.dev) {
                return this.isTypeImg ? 'images-normal' : 'images-bg';
            }

            return this.isTypeImg
                ? 'images-normal-optimized'
                : 'images-bg-optimized';
        },
        tinyImgSrc() {
            return this.dev
                ? `${this.pathToImg}/${this.url}`
                : `${this.pathToImg}/100/${this.url}`;
        },
        originalImgSrc() {
            const version = process.env.appVersion;

            return this.isTypeImg
                ? `images-normal/${this.url}?v=${version}`
                : `images-bg/${this.url}?v=${version}`;
        },
        // название файла
        filename() {
            return basename(this.url);
        },
        // Оригинальный тип
        filetype() {
            return this.url.split('.')[1];
        },
        // Набор классов для картинов внутри picture, вывел отдельно так как они повторяются
        originalImgClasses() {
            return [
                `all-full object-fit-polyfill transition-original-image opacity-0`,
                { 'opacity-100': this.isOriginalLoaded }
            ];
        }
    },
    methods: {
        tinyLoaded() {
            this.isTinyLoaded = true;
        },
        originalLoaded() {
            this.isOriginalLoaded = true;
        },
        originalImgSrcset(type) {
            if (this.dev) {
                return this.originalImgSrc;
            }

            // srcset должен быть динамичным и держать себе размеры которые указаны в массиве sizes
            // пример тут https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
            const generateSrcSetArr = this.sizes.map(size => {
                // Для того чтобы картинки не кэшировались

                const version = process.env.appVersion;
                const path = `${this.pathToImg}/${size}/${this.filename}.${type}?v=${version}`;
                if (size === 'normal') size = 1024;

                return `${path} ${size}w`;
            });

            return generateSrcSetArr.join(',');
        }
    }
};
</script>

<style lang="postcss" scoped>
.transition-original-image {
    transition: opacity 400ms ease 0ms;
}

.tiny {
    filter: blur(5px);
    transform: scale(1);
    transition: visibility 0ms ease 400ms;
}
</style>
