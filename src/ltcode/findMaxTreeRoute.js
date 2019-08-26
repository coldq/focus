/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
function TreeNode(val) {
    this.val = val;
    this.left = this.right = null;
}
let root = new TreeNode(2);
root.left = new TreeNode(-1);
// root.right = new TreeNode(7);

let max = Number.MIN_SAFE_INTEGER;

let maxPathSum = function(root) {
    if (!root) return 0;
    find(root);
    return max;
};
function find(root) {
    if (!root) return 0;
    const left = find(root.left),
        right = find(root.right);
    max = Math.max(
        max,
        root.val + left + right,
        root.val + left,
        root.val + right,
        root.val
    );

    return Math.max(root.val, root.val + left, root.val + right);
}
console.log(maxPathSum(root));
