import effect, {ref, dep, EffectFn} from '../reactive/effect'

test('effect trigger', () => {
  let foo = {
     a: 0
  }
  let r = ref(foo);
  let traggerCounter = 0
  function effectFn() {
    r.a++
    traggerCounter++
  }
  effect(effectFn)
  r.a++
  r.a++
  expect(traggerCounter).toBe(3)
})

test('effect cleanup', () => {
  let foo = {
      a: 0,
      b: 0,
      ok: true
  }
  let r = ref(foo);
  function effectFn() {
    r.ok ? r.a : ''
  }

  let wrapperFn: EffectFn = effect(effectFn)
  expect(wrapperFn?.dep.length).toBe(2)
  r.ok = false
  expect(wrapperFn?.dep.length).toBe(1)
})