![Alt text](doc/logo.png)

# IdolScript

IdolScript is a coding language influenced by Javascript and based around the world of idols and the popular anime/manga series Oshi no Ko. Navigate through code in a new way with familiar functions now under new names based on idols and Oshi no Ko. There are also some new functions present that will provide users with some new, interesting concepts to dabble in. Aimed for those familiar with JavaScript who are looking for a nice little twist to make their coding a little more interesting.

## Github Pages ##
https://ja32sc.github.io/IdolScript/

## Features ##
- JavaScript-like syntax
- Idol and Oshi no Ko themed keywords
- String interpolation that allows combination of strings
- Hidden variables (to be implemented with a secrets keyword in the future)
- Themed Error Messages (to be implemented)


# Examples


## Functions  ##

<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>

```javascript
function addNumbers(a,b) {
  return a + b;
}
```

</td>

<td>

```
episode addNumbers(a,b) {
  encore a + b;
}
```

</td>
</table>

## Variable  ##

<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>

```javascript
let x = 0
const y = 1
var z = 2
```

</td>

<td>

```
idol x = 0
idol y = 1
idol z = 2
```

</td>
</table>


## Printing ##

<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>

```javascript
console.log(“Hello world!”)
```

</td>

<td>

```
perform “Hello world!”
```

</td>
</table>

## If statements ##


<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>
    
```javascript
if (x + y = 10) {
  return True;
} else {
  return False;
}
```
</td>
<td>
    
```
plotTwist (x + y = 10) {
  encore True
} fate {
  encore False
} 
```
</td>
</table>


## For and While Loops ##


<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>
    
```javascript
for (let i = 0; i < 5; i++) {
  console.log ("In the Spotlight!");
  if (i === 3) {
    break;
  }
}
```
</td>
<td>
    
```
spotlight (idol i = 0; i < 5; i++) {
  perform ("In the Spotlight!");
  if (i === 3) {
    exitStage;
  }
}
```
</td>
</table>


<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>
    
```javascript
let i = 0

while (i < 5) {
  console.log("Auditioning...")
  if (i === 3) {
    break;
  }
  i++;
}
```
</td>
<td>
    
```
idol i = 0

audition(i < 5) {
  perform("Auditioning...")
  if (i === 3) {
    exitStage;
  }
  i++;
}
```
</td>
</table>


## Arrays ##


<table>
<tr> <th>JavaScript</th><th>IdolScript</th><tr>
</tr>
<td>
    
```javascript
let arr = [];  
arr.push("Ai");  
arr.push("Nino");  

console.log(arr);  // Output: [ "Ai", "Nino" ]

let lastMember = arr.pop();  
console.log(lastMember);  // Output: Nino

console.log(arr);  // Output: [ "Ai" ]
```
</td>
<td>
    
```
idol unit = [];  
unit.addMember("Ai");  
unit.addMember("Nino")

perform(unit);  // Output: [ "Ai", "Nino" ]; 

// Graduating a member (removing them from the group)
idol lastMember = unit.graduate();  
perform(lastMember); 

perform(unit);  // Output: [ Ai ]
```
</td>
</table>



## Static Errors ##
- Undeclared Variable: Using a variable that hasn’t been declared.
- Out-of-Scope Variable: Accessing a variable outside its scope.
- Invalid encore (return) Usage: Using encore outside a function.
- Invalid exitStage (break) Usage: Using exitStage outside a loop.
- Invalid Operations Between Types: Performing an operation on incompatible types
- Function Return Type Mismatch: Returning a value that does not match the expected return type.
- Wrong Number of Arguments: Calling a function with too many or too few arguments.
- Calling a Non-Function: Attempting to call a variable that is not a function.
- Infinite Recursion Detection: Detecting a function that calls itself indefinitely without a base case.
- Redeclaration of Constants (idol): Attempting to reassign a constant variable.
- Invalid Array Operations: Using array methods incorrectly.
- Accessing Private (Backstage) Variables from Outside: Trying to use a private variable outside its defined scope.

