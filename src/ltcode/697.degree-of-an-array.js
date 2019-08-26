/*
 * @lc app=leetcode id=697 lang=javascript
 *
 * [697] Degree of an Array
 *
 * https://leetcode.com/problems/degree-of-an-array/description/
 *
 * algorithms
 * Easy (48.85%)
 * Total Accepted:    43.7K
 * Total Submissions: 88.2K
 * Testcase Example:  '[1,2,2,3,1]'
 *
 * Given a non-empty array of non-negative integers nums, the degree of this
 * array is defined as the maximum frequency of any one of its elements.
 * Your task is to find the smallest possible length of a (contiguous) subarray
 * of nums, that has the same degree as nums.
 * 
 * Example 1:
 * 
 * Input: [1, 2, 2, 3, 1]
 * Output: 2
 * Explanation: 
 * The input array has a degree of 2 because both elements 1 and 2 appear
 * twice.
 * Of the subarrays that have the same degree:
 * [1, 2, 2, 3, 1], [1, 2, 2, 3], [2, 2, 3, 1], [1, 2, 2], [2, 2, 3], [2, 2]
 * The shortest length is 2. So return 2.
 * 
 * 
 * 
 * 
 * Example 2:
 * 
 * Input: [1,2,2,3,1,4,2]
 * Output: 6
 * 
 * 
 * 
 * Note:
 * nums.length will be between 1 and 50,000.
 * nums[i] will be an integer between 0 and 49,999.
 * 
 */
/**
 * @param {number[]} nums
 * @return {number}
 */
var findShortestSubArray = function(nums) {
    const deg = new Map();
    let now;
    for(let i=0; i<nums.length; i++) {
        now = deg.get(nums[i])
        if(now) {
            now.freq += 1;
            now.end = i;
        } else {
            now = {
                freq: 1,
                start: i,
                end: i
            }
        }
        deg.set(nums[i], now);
    }
    let ret;
    deg.forEach((obj, k, m) => {
        if(!ret || obj.freq > ret.freq){
            ret = obj;
            return;
        }
        if(obj.freq === ret.freq && (obj.end-obj.start+1) < (ret.end-ret.start+1)) {
            ret = obj
        }
    })
    return ret.end - ret.start + 1
};

