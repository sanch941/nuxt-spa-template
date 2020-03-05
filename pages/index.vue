<template>
    <div>
        <div style="height: 300px; width: 300px">
            <LazyImage url="original.jpg" />
        </div>
    </div>
</template>

<script>
import LazyImage from '../components/lazy-image/LazyImage.vue';
export default {
    components: { LazyImage }
};
</script>
