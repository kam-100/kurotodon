#!/bin/bash -eu

BUILDDIR=$(cd $(dirname $0);pwd)
ROOT=$BUILDDIR/..
TEMP=$BUILDDIR/buildtemp
ZIP=$BUILDDIR/kurotodon_foundation.zip

if [ ! -e $ROOT/manifest.json ]; then
  echo "ERROR: $ROOT/manifest.json not exist. Aborting."
  exit 16
fi

echo "START BUILD"
echo "ROOT       = $ROOT"
echo "BUILD DIR  = $BUILDDIR"
echo "BUILD TEMP = $TEMP"
echo "ARTIFACT   = $ZIP"

cd $ROOT

# 1. copy all files into temp
# 2. zip temp dir
echo "Copy all files into temp dir"
rm -rf $TEMP
mkdir -p $TEMP
rsync -r --exclude '.git' --exclude 'build' ./* $TEMP/
echo "Copying done."

echo "Copy all files into temp dir"
rm -rf $TEMP
mkdir -p $TEMP
rsync -r --exclude '.git' --exclude 'build' ./* $TEMP/
echo "Copying done."

# 
echo "Create ZIP"
rm -f $ZIP

cd $TEMP
zip -r $ZIP .
echo "Done"

cd $ROOT
echo "Build success."
