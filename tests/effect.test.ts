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

test('ref dep', () => {
  let foo = {
    a: 'bar'
  }
  let r = ref(foo);
  function effectFn() {
    console.log(r.a)
  }
  effect(effectFn)
  effect(effectFn)
  expect(dep.has(foo)).toBeTruthy()
  expect(dep.get(foo)?.has('a')).toBeTruthy()
  expect(dep.get(foo)?.get('a')?.size).toBe(1)
  expect(dep.get(foo)?.get('a')?.values().next().value).toBe(effectFn)
})