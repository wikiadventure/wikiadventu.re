echo "Install global lib"
npm i -g lix; npm i -g nodemon; npm i -g @quasar/cli
echo "Install local lib"
cd back; npm i; cd ../bin; npm i; cd ../front; npm i
