import effect, {ref, dep} from '../reactive/effect'

test('ref get', () => {
  let foo = {
    get a() {
      return this.a
    }
  }
  let bar = {
    a: 'bar'
  }
  let r = ref(foo);
  expect(Reflect.get(r, 'a', bar)).toBe(Reflect.get(bar, 'a'));
});


test('ref def trigger', () => {
  let foo = {
     a: 0
  }
  let r = ref(foo);
  let traggerCounter = 0
  function effectFn() {
    console.log(r.a++)
    traggerCounter++
  }
  effect(effectFn)
  r.a++
  r.a++
  expect(traggerCounter).toBe(3)
})