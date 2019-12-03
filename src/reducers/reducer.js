export default function (state={
    page: '123'
}, action) {
    switch(action.type) {
        case 'TODO':
            return [1,2,3];
        default:
            return state;
    }
}
