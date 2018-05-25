
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const statAsync = promisify(fs.stat);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Copies one file from a certain location to a desired "to" location
 * @param {String} from - File to copy
 * @param {any} to - Destination of file
 */
function copyTo(from, to) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(from);
    const writeStream = fs.createWriteStream(to);
    writeStream.once('finish', resolve);
    writeStream.once('error', reject);
    readStream.pipe(writeStream);
  });
}

/**
 * Generates a webpack config with my (stratodyne) approved defaults, plugins and such.
 * @param {String} dir - Dir where your package.json lives
 */
async function generator(dir) {
  if (!dir) throw new Error('Unable to generate webpack config and install dependencies without a directory');
  const p = path.isAbsolute(dir) ? dir : path.resolve(dir);
  try {
    const packageFile = path.join(p, 'package.json');
    console.info(`Using package.json file found at ${packageFile}`);
    const stat = await statAsync(packageFile);
    if (stat.isFile()) {
      const installs = [
        'react',
        'prop-types',
        'react-dom',
        'redux',
        'react-redux',
        'redux-thunk',
        'reselect',
        'reset-css',
        'webpack',
        'webpack-dev-server',
        'webpack-cli',
        'stylus',
        'stylus-loader',
        'css-loader',
        'style-loader',
        'autoprefixer',
        'postcss-loader',
        'url-loader',
        'babel-core',
        'babel-loader',
        'babel-preset-react',
        'babel-plugin-syntax-object-rest-spread',
        'babel-plugin-syntax-class-properties',
        'html-webpack-plugin',
        'clean-webpack-plugin',
        'write-file-webpack-plugin',
        'babel-eslint',
        'eslint',
        'eslint-config-airbnb',
        'eslint-plugin-import',
        'eslint-plugin-jsx-a11y',
        'eslint-plugin-react',
      ];
      process.chdir(p);
      execSync(`npm install ${installs.join(' ')} --save-dev`, { stdio: 'inherit' });
      process.chdir(__dirname);
      await copyTo(path.join(__dirname, 'schema.js'), path.join(p, 'webpack.config.js'));
      await copyTo(path.join(__dirname, '.eslintrc.schema.json'), path.join(p, '.eslintrc.json'));
      await copyTo(path.join(__dirname, 'htmlTemplate.ejs'), path.join(p, 'htmlTemplate.ejs'));
    }
  } catch (error) {
    console.error('Unable to generate config and install dependencies');
    console.error(error);
  }
}

module.exports = generator;

if (!module.parent) generator(process.argv[2]);
