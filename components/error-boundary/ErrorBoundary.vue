<template>
    <div v-if="!hasError">
        <slot />
    </div>
    <div v-else class="error">
        <div class="message">{{ errorMessage }}</div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            hasError: state => state.error.hasError,
            errorMessage: state => state.error.errorMessage
        })
    }
};
</script>

<style lang="postcss" scoped>
.error {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message {
    padding: 50px 100px;
    border-radius: 10px;
    background: #fff;
    white-space: pre-line;
}
</style>
