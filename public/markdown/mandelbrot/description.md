Scroll/pinch to zoom, and drag to move around while zoomed. Use the cursor to change $z_0$ and $c$ values of the other plot.

Above are 2 fractal color plots which shows the **Mandelbrot Set** (left/top) and its corresponding **Julia Set** (right/bottom). These plots are governed by the equation

$$z_{n+1}=z_n^2+c.$$

The coordinates in the **Mandelbrot plot** corresponds to an initial complex number $z_0$, and given a $c$ value represented by the cursor position on the **Julia Plot** which is then iterated $n$ times through the above equation. Each iteration, we check if the value of $z_n$ diverges, i.e. the magnitude of the complex value increases significantly. The pure black color represents initial values that do not diverge, and for the diverging initial values, it is represented by a repeating gradient pattern.

A similar description can be said for the **Julia plot**, except each coordinate represents a $c$ value, and the $z_0$ value is represented by the cursor position on the **Mandelbrot Plot**.

Play around with the cursors and iterations to see what beautiful fractals you can generate. Note that higher iterations require longer computing times, so the program will be slower.

For actual fractal plots, this should be infinitely zoomable and you'll continue to see chaotic patterns, but this implementation here is limited by floating-point precision. 