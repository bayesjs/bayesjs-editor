// code adapted from:
// http://stackoverflow.com/questions/18362533/converting-a-circle-to-ellipse-so-it-calculates-the-distance-of-a-point-from-an

const halfPI = Math.PI / 2;
const steps = 15;

// calc a point on the ellipse that is "near-ish" the target point
// uses "brute force"
export const getEllipseNearestPoint =
(ellipseCenterX, ellipseCenterY, ellipseRadiusX, ellipseRadiusY, targetPointX, targetPointY) => {

  // calculate which ellipse quadrant the targetPt is in
  let q;
  if (targetPointX > ellipseCenterX) {
    q = (targetPointY > ellipseCenterY) ? 0 : 3;
  } else {
    q = (targetPointY > ellipseCenterY) ? 1 : 2;
  }

  // calc beginning and ending radian angles to check
  const r1 = q * halfPI;
  const r2 = (q + 1) * halfPI;
  const dr = halfPI / steps;
  let minLengthSquared = 200000000;
  let minX;
  let minY;

  // walk the ellipse quadrant and find a near-point
  for (let r = r1; r < r2; r += dr) {

    // get a point on the ellipse at radian angle == r
    const ellipseX = ellipseCenterX + ellipseRadiusX * Math.cos(r);
    const ellipseY = ellipseCenterY + ellipseRadiusY * Math.sin(r);

    // calc distance from ellipsePt to targetPt
    const dx = targetPointX - ellipseX;
    const dy = targetPointY - ellipseY;
    const lengthSquared = dx * dx + dy * dy;

    // if new length is shortest, save this ellipse point
    if (lengthSquared < minLengthSquared) {
      minX = ellipseX;
      minY = ellipseY;
      minLengthSquared = lengthSquared;
    }
  }

  return ({
    x: minX,
    y: minY
  });
};
