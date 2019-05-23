export function stringToTimeArray( timeStr ) {
    return timeStr.split(':').map(Number)
}

export function timeArrayToString( timeArray ) {
    return timeArray.map( num => String(num || 0) ).map( str => str.padStart(2, '0') ).join(':')
}

export function timeArrayToMinutes( timeArray ) {
    return timeArray[0] * 60 + timeArray[1]
}