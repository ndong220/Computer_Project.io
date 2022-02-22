const fs = require('fs');
const path = require('path');
const {
  generateTheme
} = require('antd-theme-generator');

// Specify the name of the theme variables to be changed, default is `@primary-color`
// Can be set all antd & ng-alain custom theme variables
const themeVariables = [
  '@primary-color'
];

const root = path.resolve(__dirname, '..');
const outputFilePath = path.join(root, './src/assets/alain-pro.less');

const options = {
  stylesDir: path.join(root, './src'),
  antdStylesDir: path.join(root, './node_modules/ng-zorro-antd'),
  varFile: path.join(root, './src/styles/theme.less'),
  mainLessFile: path.join(root, './src/styles.less'),
  themeVariables,
  outputFilePath,
};

function removeOutputFile() {
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }
}

removeOutputFile();
generateTheme(options)
  .then(() => {
    console.log('Theme generated successfully');
  })
  .catch(error => {
    console.log('Error', error);
  });
