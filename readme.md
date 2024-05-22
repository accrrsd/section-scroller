<h1>React Section Scroller</h1>
<h3>A component for creating a smooth scrolling sectioned layout</h3>

### Installation

`npm install react-section-scroller`

#### or

`yarn add section-scroller`

### [Usage Demo](https://codesandbox.io/p/sandbox/react-section-scroller-demo-zsnspx?file=%2Fsrc%2FApp.tsx)

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
    <td>An array with elements, element should be something that can have offset properties, if needed - you can wrap it in div before adding to scroller.</td>
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
    <td>activeIndex</td>
    <td>number</td>
    <td>If defined, update slider active index, needed for outside setter, like buttons</td>
    <td>-</td>
  </tr>
  <tr>
    <td>initialSlideIndex</td>
    <td>number</td>
    <td>The index of the slide to be displayed initially.</td>
    <td>0</td>
  </tr>
  <tr>
    <td>slidesOffset</td>
    <td>number<br>number[]<br>string<br>string[]<br>number|string[]</td>
    <td> number|string or array of numbers|strings specifying an offset to be applied to each slide"s position. If number - pixel offset, if string with percentage, like 30% - offset calculates by size of slider, if string with vw|vh - it works like in css.</td>
    <td>0</td>
  </tr>
  <tr>
  <td>navigationKeys</td>
  <td>{increaseKeys:string | string[],<br> decreaseKeys:string | string[]}</td>
  <td>The one or multiple keys that will navigate to the next/prev slide</td>
  <td>-</td>
  </tr>
  <tr>
  <td>getRealtimeScrollPos</td>
  <td>(number, direction)=>unknown</td>
  <td>A function to be called when scroll with realtime scroll offset pos. Use it only for light weigh realtime calculation, like animation.</td>
  <td>-</td>
  </tr>
  <tr>
  <td>getPostScrollPos</td>
  <td>(number, direction)=>unknown</td>
  <td>A function to be called when scroll ends with the currently scroll offset pos and direction</td>
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
