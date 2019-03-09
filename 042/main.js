/*//

const samples = [Point,Point,Point,Point,....]
const triangles = DelaunayTriangulation.calc(samples);

//*/

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  isEqual(point) {
    return this.x == point.x && this.y == point.y;
  }
}

class Edge {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
  isEqual(edge) {
    return (
      (this.p1.isEqual(edge.p1) && this.p2.isEqual(edge.p2)) ||
      (this.p1.isEqual(edge.p2) && this.p2.isEqual(edge.p1))
    );
  }
}

class Triangle {
  constructor(p1, p2, p3) {
    this.edges = [new Edge(p1, p2), new Edge(p2, p3), new Edge(p3, p1)];
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
  }

  isIncludePoint(p) {
    var x1 = this.p1.x;
    var y1 = this.p1.y;
    var x2 = this.p2.x;
    var y2 = this.p2.y;
    var x3 = this.p3.x;
    var y3 = this.p3.y;

    var x1_2 = x1 * x1;
    var x2_2 = x2 * x2;
    var x3_2 = x3 * x3;
    var y1_2 = y1 * y1;
    var y2_2 = y2 * y2;
    var y3_2 = y3 * y3;

    var c = 2 * ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
    var x =
      ((y3 - y1) * (x2_2 - x1_2 + y2_2 - y1_2) +
        (y1 - y2) * (x3_2 - x1_2 + y3_2 - y1_2)) /
      c;
    var y =
      ((x1 - x3) * (x2_2 - x1_2 + y2_2 - y1_2) +
        (x2 - x1) * (x3_2 - x1_2 + y3_2 - y1_2)) /
      c;
    var _x = x1 - x;
    var _y = y1 - y;
    var r = Math.sqrt(_x * _x + _y * _y);

    var xx = p.x - x;
    var yy = p.y - y;
    var len = Math.sqrt(xx * xx + yy * yy);

    // console.log(x, y, r, this.p1, this.p2, this.p3);
    this.circleX = x;
    this.circleY = y;
    this.circleR = r;

    return len < r;
  }

  isEqual(triangle) {
    var tmp = triangle.edges.slice();
    this.edges.forEach(edge => {
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].isEqual(edge)) {
          tmp.splice(i, 1);
        }
      }
    });
    return tmp.length == 0;
  }

  hasEdge(edge) {
    return (
      this.edges[0].isEqual(edge) ||
      this.edges[1].isEqual(edge) ||
      this.edges[2].isEqual(edge)
    );
  }

  getNoEdgePoint(edge) {
    if (this.edges[0].isEqual(edge)) return this.p3;
    if (this.edges[1].isEqual(edge)) return this.p1;
    if (this.edges[2].isEqual(edge)) return this.p2;
  }

  hasPoint(p) {
    return this.p1.isEqual(p) || this.p2.isEqual(p) || this.p3.isEqual(p);
  }
}

class DelaunayTriangulation {
  static calc(points) {
    const samples = points.slice();
    const triangles = [];
    const superTriangle = this.makeSuperTriangle();
    triangles.push(superTriangle);

    while (0 != samples.length) {
      const pi = samples.pop();

      const includesTriangle = [];
      triangles.forEach(triangle => {
        if (triangle.isIncludePoint(pi)) {
          includesTriangle.push(triangle);
        }
      });

      const s = [];
      for (var i = 0; i < includesTriangle.length; i++) {
        const triangle = includesTriangle[i];

        s.push(new Edge(triangle.p1, triangle.p2));
        s.push(new Edge(triangle.p2, triangle.p3));
        s.push(new Edge(triangle.p1, triangle.p3));

        removeTriangle(triangle);
        triangles.push(new Triangle(triangle.p1, triangle.p2, pi));
        triangles.push(new Triangle(triangle.p2, triangle.p3, pi));
        triangles.push(new Triangle(triangle.p1, triangle.p3, pi));
      }

      while (0 != s.length) {
        const edge1 = s.pop();

        var hasEdgeTriangles = [];
        for (var i = 0; i < triangles.length; i++) {
          if (triangles[i].hasEdge(edge1)) {
            hasEdgeTriangles.push(triangles[i]);
          }
        }

        if (hasEdgeTriangles.length <= 1) {
          continue;
        }

        const abcTriangle = hasEdgeTriangles[0];
        const abdTriangle = hasEdgeTriangles[1];
        const cPoint = abcTriangle.getNoEdgePoint(edge1);
        const dPoint = abdTriangle.getNoEdgePoint(edge1);

        if (abcTriangle.isEqual(abdTriangle)) {
          removeTriangle(abcTriangle);
          removeTriangle(abdTriangle);
          continue;
        }

        if (abcTriangle.isIncludePoint(dPoint)) {
          removeTriangle(abcTriangle);
          removeTriangle(abdTriangle);

          triangles.push(new Triangle(edge1.p1, cPoint, dPoint));
          triangles.push(new Triangle(edge1.p2, cPoint, dPoint));

          s.push(new Edge(edge1.p1, cPoint));
          s.push(new Edge(cPoint, edge1.p2));
          s.push(new Edge(edge1.p2, dPoint));
          s.push(new Edge(dPoint, edge1.p1));
        }
      }
    }

    for (var i = 0; i < triangles.length; i++) {
      if (triangles[i].hasPoint(superTriangle.p1)) {
        removeTriangle(triangles[i]);
        i--;
        continue;
      }
      if (triangles[i].hasPoint(superTriangle.p2)) {
        removeTriangle(triangles[i]);
        i--;
        continue;
      }
      if (triangles[i].hasPoint(superTriangle.p3)) {
        removeTriangle(triangles[i]);
        i--;
        continue;
      }
    }

    return triangles;

    function removeTriangle(triangle) {
      for (var i = 0; i < triangles.length; i++) {
        if (triangles[i].isEqual(triangle)) {
          triangles.splice(i, 1);
        }
      }
    }
  }

  static makeSuperTriangle() {
    const p1 = new Point(0, 0);
    const p2 = new Point(SIZE * 2, 0);
    const p3 = new Point(0, SIZE * 2);
    return new Triangle(p1, p2, p3);
  }
}

const Stats = require("stats-js");

const SIZE = 500;
const canvas = document.getElementById("canvas");
canvas.width = SIZE;
canvas.height = SIZE;

let samples = [];
Array(50)
  .fill(0)
  .map((item, index) => {
    samples.push(
      new Point(
        Math.floor(Math.random() * SIZE),
        Math.floor(Math.random() * SIZE)
      )
    );
  });

samples.push(new Point(1, 1));
samples.push(new Point(SIZE - 1, 1));
samples.push(new Point(1, SIZE - 1));
samples.push(new Point(SIZE - 1, SIZE - 1));

const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "lightgray";
samples.forEach(sample => {
  ctx.fillRect(sample.x, sample.y, 2, 2);
});

var rad = 0.0;
function loop() {
  stats.begin();
  requestAnimationFrame(loop);
  //
  // console.time("DelaunayTriangulation");

  rad += 0.01;
  for (var i = 0; i < samples.length - 4; i++) {
    samples[i].x += Math.sin(rad + i * 0.1);
    samples[i].y += Math.cos(rad + i * 0.1);
    if (samples[i].x <= 0) samples[i].x = 0;
    if (samples[i].x >= SIZE) samples[i].x = SIZE;
    if (samples[i].y <= 0) samples[i].y = 0;
    if (samples[i].y >= SIZE) samples[i].y = SIZE;
  }

  const triangles = DelaunayTriangulation.calc(samples);

  // console.timeEnd("DelaunayTriangulation");
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  triangles.forEach(triangle => {
    // ctx.lineWidth = calcTriangleSize(triangle) / 1000;
    // ctx.globalAlpha = 0.3 + calcTriangleSize(triangle) / 2000;

    // ctx.strokeStyle = "white";
    // ctx.lineWidth = 0.5;
    ctx.strokeStyle =
      // ctx.fillStyle =
      "rgba(0, 0, 0, " +
      Math.log(Math.pow(calcTriangleSize(triangle), 2)) * 0.03 +
      ")";
    ctx.beginPath();
    ctx.moveTo(triangle.p1.x, triangle.p1.y);
    ctx.lineTo(triangle.p2.x, triangle.p2.y);
    ctx.lineTo(triangle.p3.x, triangle.p3.y);
    ctx.lineTo(triangle.p1.x, triangle.p1.y);
    ctx.closePath();
    ctx.stroke();
    // ctx.fill();

    // ctx.strokeStyle = "lightgray";
    // ctx.lineWidth = 1.0;
    // ctx.beginPath();
    // ctx.arc(
    //   triangle.circleX,
    //   triangle.circleY,
    //   triangle.circleR,
    //   0,
    //   2 * Math.PI
    // );
    // ctx.closePath();
    // ctx.stroke();
  });

  stats.end();
}

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);

loop();
// setInterval(loop, 1000);

function calcTriangleSize(triangle) {
  return (
    0.5 *
    Math.abs(
      (triangle.p1.x - triangle.p3.x) * (triangle.p2.y - triangle.p3.y) -
        (triangle.p2.x - triangle.p3.x) * (triangle.p1.y - triangle.p3.y)
    )
  );
}
