cp -r build/beakerbrowser/.dat ./dat
npm run build
mv dat build/beakerbrowser/.dat
cd build/beakerbrowser
dat share
