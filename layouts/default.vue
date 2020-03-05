<template>
    <div>
        <notifications group="fileupload" position="top center" />
        <ErrorBoundary>
            <nuxt />
        </ErrorBoundary>
    </div>
</template>

<script>
import ErrorBoundary from '../components/error-boundary/ErrorBoundary.vue';
export default {
    components: { ErrorBoundary }
};
</script>
