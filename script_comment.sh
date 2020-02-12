#!/bin/bash
if  [ "$TRAVIS_BRANCH" == "deploy/production" ]
then
  sed -i '21,140 s/^/#/' .travis.yml
else
  sed -i '141,250 s/^/#/' .travis.yml
fi
cat .travis.yml
