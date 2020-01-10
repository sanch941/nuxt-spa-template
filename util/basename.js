// изменяет к примеру "test/test.png" на "test", то есть возвращает только имя файла
export const basename = (path) => {
    path = path.split(/[\\/]/).pop();

    return path.split('.')[0];
};
