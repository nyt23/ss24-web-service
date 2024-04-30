const role_parent = 'parent';
const role_child = 'child';

export function isParent(request, response, next) {
    if (request.user && request.user.roles.includes(role_parent)) {
        return next();
    } else {
        return response.status(401).send('Unauthorized');
    }
}
export function isChild(request, response, next) {
    if (request.user && request.user.roles.includes(role_child)) {
        return next();
    } else {
        return response.status(401).send('Unauthorized');
    }
}