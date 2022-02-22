const less = require('less');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const LessPluginNpmImport = require('less-plugin-npm-import');
const lessToJs = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const appStyles = 'src/styles.less'; // 应用的样式入口文件
const themeContent = `@import '${appStyles}';`;

function genVar(type) {
  const ngZorroAntdStylePath = path.join(root, 'node_modules/ng-zorro-antd/style');
  const ngZorro = `
  ${fs.readFileSync(path.join(ngZorroAntdStylePath, 'color/colors.less'), 'utf8')}
  ${fs.readFileSync(path.join(ngZorroAntdStylePath, `themes/${type}.less`), 'utf8')}
  `;

  const delonStylePath = path.join(root, 'node_modules/@delon');
  const ngAlain = `
  ${fs.readFileSync(path.join(delonStylePath, `theme/system/theme-${type}.less`), 'utf8')}
  ${fs.readFileSync(path.join(delonStylePath, `abc/theme-${type}.less`), 'utf8')}
  ${fs.readFileSync(path.join(delonStylePath, `chart/theme-${type}.less`), 'utf8')}
  ${fs.readFileSync(path.join(root, `./src/app/layout/pro/styles/theme-${type}.less`), 'utf8')}
  ${fs.readFileSync(path.join(root, `./src/styles/fix/theme-${type}.less`), 'utf8')}
  `;

  return lessToJs(`${ngZorro}${ngAlain}`, {
    stripPrefix: true,
    resolveVariables: false,
  });
}

function gen(type) {
  return less
    .render(themeContent, {
      javascriptEnabled: true,
      plugins: [new LessPluginNpmImport({ prefix: '~' }), new LessPluginCleanCSS({ advanced: true })],
      modifyVars: {
        ...genVar(type),
      },
    })
    .then((data) => {
      fs.writeFileSync(
        // 主题样式的输出文件
        `src/assets/style.${type}.css`,
        data.css,
      );
    })
    .catch((e) => {
      // 记录渲染错误
      console.error(type, e);
    });
}

Promise.all([gen('dark'), gen('compact')]).then(() => {
  console.log('Success!');
});
