# London_Weather_Vite

A small app to display a three day forecast for London weather from a free weather API endpoint. Made for fun and as a technical exercise to adapt to TypeScript. All content is rendered exclusively on an HTML Canvas.

Notable features:
- Dynamic rescaling of the canvas for portrait and landscape view, scaled to window size to mimic css media queries.
- Dynamic rescaling of font-size to fit the area assigned to text and avoid bleed. 
- Data bound text and image regions to only update areas of the canvas that need changing, following an asynchronous data update. This allows for smoother screen updating with no flicker.

# Build hosted on Vercel
https://london-weather-vite.vercel.app/