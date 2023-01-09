#!/bin/sh

set -e

cd "$(dirname "$0")"


#
# Make sure that everything is up-to-date
#
git pull
(cd ../danielwippermann.github.io && git pull)


#
# Remove node_modules directory
#
rm -rf public/resol-vbus/node_modules/


#
# Update JSDoc information
#
npx jsdoc --template ./node_modules/jsdoc-json --destination public/doc.json --recurse -R public/resol-vbus/README.md public/resol-vbus/src


#
# Update Git version information
#
if [ "$(cd public/resol-vbus; git status --short -uno)" == "" ]; then
    IS_DIRTY=false
else
    IS_DIRTY=true
fi

cat <<EOS > src/version.json
{
  "describe": "$(cd public/resol-vbus; git describe --tags --long --dirty)",
  "commit": "$(cd public/resol-vbus; git rev-parse HEAD)",
  "isDirty": $IS_DIRTY
}
EOS


#
# Build static site
#
npm run build


#
# Restore version.json to SNAPSHOT state
#
cp src/version.json.example src/version.json


#
# Copy over static files
#
rm -rf dist/resol-vbus/.git
rsync -avP --delete-after dist/ ../danielwippermann.github.io/resol-vbus/


#
# Commit and push updated github.io site
#
cd ../danielwippermann.github.io
git add resol-vbus
git commit resol-vbus -m "Update resol-vbus documentation."
git push origin master
