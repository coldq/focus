/*
 * @lc app=leetcode id=42 lang=javascript
 *
 * [42] Trapping Rain Water
 *
 * https://leetcode.com/problems/trapping-rain-water/description/
 *
 * algorithms
 * Hard (42.25%)
 * Total Accepted:    267.4K
    * Total Submissions: 632K
    * Testcase Example:  '[0,1,0,2,1,0,1,3,2,1,2,1]'
    *
    * Given n non-negative integers representing an elevation map where the width
    * of each bar is 1, compute how much water it is able to trap after raining.
    * 
    * 
    * The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1].
    * In this case, 6 units of rain water (blue section) are being trapped. Thanks
    * Marcos for contributing this image!
    * 
    * Example:
    * 
    * 
    * Input: [0,1,0,2,1,0,1,3,2,1,2,1]
    * Output: 6
    * 
    */
/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    let stack = []
    let i = 0, trapVol = 0
    while(i < height.length) {
        if( 
            (stack.length === 0 && height[i] === 0) ||
            (stack.length===1 && height[i] === stack[0])
        ) {
            i++;
            continue;
        }
        if(height[i] >= stack[0]) {
            stack.push(height[i])
            trapVol += getVol(stack);
            stack = [height[i]];
        } else {
            stack.push(height[i])
        }
        i++
    }
    if(stack.length > 1) {
        trapVol += trap(stack.reverse())
    }
    return trapVol
};
function getVol(stack) {
    let i = 0, l = stack.length-1
    let vol = Math.min(stack[0], stack[l]) * (l - 1 - i);
    while(i < l-1) {
        i++;
        vol -= stack[i];
    }
    return vol;
}
