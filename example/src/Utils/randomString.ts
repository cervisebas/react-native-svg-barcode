export default function (ln: number) {
  let result = ' ';
  for (let i = 0; i < ln; i++) {
    result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  return result;
}
