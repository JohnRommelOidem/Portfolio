Scroll/pinch to zoom, and drag to move around while zoomed. Use the cursor to change polynomial roots.

Newton's method is a numerical method to solve for the roots of a function, i.e., find $x$ for a generic equation

$$f(x)=0$$

The method starts with a *guess* $x_0$, then iterate $n$ times using the equation

$$x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}.$$

Most of the time, the value of $x_n$ converges into a value, which gives one possible root of the equation. To get all roots using this method is not as simple, as guessing can only take you so far.

This can be demonstrated on the above demo. Where we take a polynomial equation, then take a whole array of initial guesses, represented by each point in the color plot, then iterate a number of times, then lastly check which actual root is the final position closest to, represented by the draggable circles.

This project is a replication of [3Blue1Brown's video on Newton's fractal](https://www.youtube.com/watch?v=-RdOwhmqP5s&t=346s)