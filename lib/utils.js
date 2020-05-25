import moment from 'moment'

export function getMomentDate(time) {
  return moment(time).fromNow()
}