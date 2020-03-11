<template>
    <div>
        <div style>
            <LazyImage url="test.png" type="img" />
        </div>
    </div>
</template>

<script>
import LazyImage from '../components/lazy-image/LazyImage.vue';
export default {
    components: { LazyImage }
};
</script>
