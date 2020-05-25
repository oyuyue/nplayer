set -e
echo "Enter release version: "
read VERSION

read -p "Releasing v$VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing v$VERSION ..."

  # commit
  VERSION=$VERSION npm run build
  git add .
  git commit -m "build: bundle $VERSION"
  npx lerna version $VERSION --yes --no-push

  # changelog
  npm run changelog
  echo "Please check the git history and the changelog and press enter"
  read OKAY
  git add CHANGELOG.md
  git commit -m "chore(changelog): $VERSION"

  # publish
  npm run publish
fi
