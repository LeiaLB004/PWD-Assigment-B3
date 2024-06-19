# &lt;my-window&gt;

A web component that represents a draggable window with a header and a close button.

## Attributes

### `title`
A string attribute that sets the title of the window, displayed in the header.

## Methods

`getWeather()`
Fetches the weather data from the OpenWeatherMap API based on the city name entered by the user. Displays an error message if the city name is not valid or if there's an issue with fetching the data.

`displayWeather(data)`
Displays the weather information in the component. It takes a weather data object as a parameter, which includes details like the city name, temperature, weather description, and icon.

## Events
No custom events are fired by this component.

## Styling with CSS
The window component can be styled using the following classes and pseudo-elements:

`Window-header` styles the header of the window.
`Close-button` styles the close button in the header.
`Window-content` styles the content area of the window.

## Example

```html
<my-window title="Sample Window">
  <p>Content of the window goes here.</p>
</my-window>
```