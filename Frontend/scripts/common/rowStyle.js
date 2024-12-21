// Overview:
// Changes the color of alternating rows

export function styleRows(index) {
    let inlineStyle = 'style=';
    if (index === 0 || index % 2 === 0) {
        inlineStyle += '"background-color: #e58383"';
    } else {
        inlineStyle +='"background-color: #ffa2a2"'
    }

    return inlineStyle;
}