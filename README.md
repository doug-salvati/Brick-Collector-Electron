# Brick Collector
A LEGO® collection manager no longer in development (see https://github.com/doug-salvati/Brick-Collector instead) using React and Electron. More detailed information will be added to this page when builds are ready for release.

## Running
You need a MySQL initialized with `schema.sql` with `config/mysql.config.js` set up appropriately from the template. 
You also need a [Rebrickable.com](https://rebrickable.com/api/) API key in `src/constants/apikey.txt`.
Then,
```
npm run watch
npm start
```

## Production Build
### Mac
Currently you still need the MySQL and Rebrickable config files.
Then, run `npm run dist`. The DMG file to install Brick Collector will be available in the `dist/` directory.

## Disclaimer
This is a non-commercial open-source application currently **in development**.
LEGO® is a trademark of the LEGO Group of companies which does not sponsor, authorize or endorse this app.
