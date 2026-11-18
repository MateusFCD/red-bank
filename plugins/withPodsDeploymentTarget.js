// Força um IPHONEOS_DEPLOYMENT_TARGET mínimo em todos os targets dos Pods.
// Xcode 27+ só aceita deployment targets >= 15.0 e alguns pods (GoogleSignIn,
// AppAuth, GTMSessionFetcher, PromisesObjC, RNSVG...) ainda declaram 9.0–12.x,
// o que faz o build falhar.
const { withPodfile } = require('expo/config-plugins');

const MARKER = '# @redbank/pods-deployment-target';

module.exports = function withPodsDeploymentTarget(config, { minTarget = '15.1' } = {}) {
  return withPodfile(config, (cfg) => {
    let podfile = cfg.modResults.contents;
    if (podfile.includes(MARKER)) return cfg;

    const snippet = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_config|
        current = build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET']
        if current.nil? || Gem::Version.new(current) < Gem::Version.new('${minTarget}')
          build_config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${minTarget}'
        end
      end
    end
`;

    podfile = podfile.replace(/(post_install do \|installer\|\n)/, `$1${snippet}`);
    cfg.modResults.contents = podfile;
    return cfg;
  });
};
