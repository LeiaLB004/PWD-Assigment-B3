# &lt;my-weather-app&gt;

A web component that represents a game timer. It can start, stop, and reset the timer, displaying the elapsed time in MM
format.

## Attributes

No custom attributes are required or used for this component.

## Events

No custom events are fired by this component.

## Methods

`startTimer()`
Starts the game timer from 00:00. The timer updates every second.

`resetTime()`
Resets the game timer to 00:00 and stops the timer if it is running.

`stopTimer()`
Stops the game timer without resetting the displayed time.

## Example

```html
<my-game-timer></my-game-timer>
```