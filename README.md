# London_Weather_Vite

A small app to display a three day forecast for London weather. Ordinarily my go-to for this would be to use HTML elements with a bunch of CSS and a sprinkling of vanilla JS. However, here I've used the HTML Canvas element almost exclusively with a copious amount of TypeScript and powered by a Vite Node JS server: all of which I have had to increase my familiarity with in order to make this. It's been great fun!

Notable features:
    - Dynamic rescaling of the canvas for portrait and landscape view, scaled to window size.
    - Dynamic rescaling of font-size to fit the area assigned to text and avoid bleed.
    - Data bound text and image regions to only update areas of the canvas that need changing, following an asynchronous data update. This allows for smoother screen updating with no flicker. However, it falls short of full-blown textbox or imagebox functionality and could be further developed into this.
# Build hosted on Vercel
https://london-weather-vite.vercel.app/