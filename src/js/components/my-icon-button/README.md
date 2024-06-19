# &lt;my-icon-button&gt;

A custom web component representing an icon button with customizable icon, hover effects, and click events.

## Attributes

### `src`
 Specifies the path to the icon image.

### `alt`
Alternative text for the icon image.
app-type: Represents the type of application or action associated with the icon.

### `app-type`
Specifies the type of application the icon represents. This value is dispatched with the icon-click event.

## Events

| Event Name      | Fired When                        |
| --------------- | --------------------------------- |
| `icon-button:icon-click`    | Fires when the icon button is clicked.        |

## Example

```html
<my-icon-button src="./icons/settings.png" alt="Settings" app-type="settings"></my-icon-button>

```
