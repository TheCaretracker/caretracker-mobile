export class ListFormatter {
  format = (list: any[]) => {
    return list.slice(0, -1).join(', ') + ' and ' + list.slice(-1)
  }
}
