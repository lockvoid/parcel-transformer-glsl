const { Transformer } = require('@parcel/plugin');
const { GlslMinify } = require('../vendor/GlslMinify');

module.exports = new Transformer({
  async transform({ asset, logger }) {
    const glslMinify = new GlslMinify({ preserveUniforms: true  });
    const code = await asset.getCode();
    const glsl = await glslMinify.execute(code);

    // const uniformsMapping = Object.keys(glsl.uniforms).reduce((uniformsMapping, uniformName) => {
    //   uniformsMapping[uniformName] = glsl.uniforms[uniformName].variableName;
    //
    //   return uniformsMapping;
    // }, {});

    asset.type = "js";

    asset.setCode(`
      export const code = ${JSON.stringify(process.env.NODE_ENV === 'production' ? glsl.sourceCode : glsl.sourceCode)};
    `);

    // asset.setCode(`
    //   export const code = ${JSON.stringify(process.env.NODE_ENV === 'production' ? glsl.sourceCode : code)};
    //   export const uniforms = ${JSON.stringify(uniformsMapping)};
    // `);

    return [
      asset,
    ];
  }
});