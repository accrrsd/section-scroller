<h1>React Section Scroller</h1>
<h3>A component for creating a smooth scrolling sectioned layout</h3>

### Installation

`npm install react-section-scroller`

#### or

`yarn add section-scroller`

### [Usage Demo]()

### Pros

<ul>
<li>
Touch Support
<br>
The component supports touch swipes for navigation on touch devices. You can adjust the touch sensitivity using the touchThreshold prop.
</li>
<br>
<li>
Keyboard navigation
<br>
You can configure keyboard navigation using the navigationKeys prop. It expects an object with two properties:
<ul>
<li> increaseKeys: An array of strings or a single string representing the keys that will navigate to the next slide. </li>
<li>decreaseKeys: An array of strings or a single string representing the keys that will navigate to the previous slide. </li>
</ul>
</li>
<br>
<li>Very simple code without dependencies</li>
Perfectly fit in any project size that uses React
</ul>

### Possible Props

<table>
<thead>
  <tr>
    <th>Props</th>
    <th>Type</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>children</td>
    <td>ReactElement[]</td>
    <td>An array of React elements representing the slides to be scrolled.</td>
    <td>-</td>
  </tr>
  <tr>
  <td>direction</td>
  <td>"vertical" | "horizontal"</td>
  <td>The scrolling direction.</td>
  <td>"vertical"</td>
  </tr>
  <tr>
  <td>touchThreshold</td>
  <td>number</td>
  <td>The minimum touch movement distance required to trigger a slide change on touch devices.</td>
  <td>50</td>
  </tr> 
  <tr>
    <td>initialSlideIndex</td>
    <td>number</td>
    <td>The index of the slide to be displayed initially.</td>
    <td>0</td>
  </tr>
  <tr>
    <td>slidesOffset</td>
    <td>number<br>number[]</td>
    <td>A number or array of numbers specifying an offset to be applied to each slide's position.</td>
    <td>0</td>
  </tr>
  <tr>
  <td>navigationkeys</td>
  <td>{increaseKeys:string | string[],<br> decreaseKeys:string | string[]}</td>
  <td>The one or multiple keys that will navigate to the next/prev slide</td>
  <td>-</td>
  </tr>
  <tr>
  <td>getScrollPos</td>
  <td>(number, direction)=>unknown</td>
  <td>A function to be called with the currently scroll offset pos and direction</td>
  <td>-</td>
  </tr>
<tr>
  <td>getActiveSlide</td>
  <td>(HTMLDivElement, number)=>unknown</td>
  <td>A function to be called with the currently active slide element and its index.</td>
  <td>-</td>
  </tr>
  <tr>
  <td>onScrollError</td>
  <td>(HTMLDivElement) => unknown</td>
  <td>A function to be called in case of a scrolling error.</td>
  <td>-</td>
  </tr>
  <tr>
  <td>scrollErrorDelay</td>
  <td>number</td>
  <td>The delay in milliseconds before triggering the onScrollError callback.</td>
  <td>1500</td>
  </tr>
</tbody>
</table>

#### And all default div props will work too.

### MIT Licence
