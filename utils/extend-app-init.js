export const extendAppInit = (app, mixin) => {
    if (!app.mixins) {
        app.mixins = [];
    }
    app.mixins.push(mixin);
};
