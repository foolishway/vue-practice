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

test('ref dep tracker', () => {
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

test('ref def tragger', () => {
  let foo = {
     a: 0
  }
  let r = ref(foo);
  let traggerCounter = 0
  function effectFn() {
    console.log(r.a)
  }
  effect(effectFn)
  foo.a++
  foo.a++
  expect(traggerCounter).toBe(2)
})