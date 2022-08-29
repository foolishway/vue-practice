type EffectFn = (() => void) | null
let activeEffect: EffectFn = null
export let dep = new WeakMap<Object, Map<string|symbol, Set<EffectFn>>>();
export function ref(source) {
  return new Proxy(source, {
    get(target, p, receiver) {
      // tracker
      if (activeEffect) {
        if (!dep.has(target)) {
          dep.set(target, new Map<string, Set<EffectFn>>())
        }
        let depMap = dep.get(target)
        if (!depMap!.has(p)) {
          depMap!.set(p, new Set())
        }
        let depSet = depMap!.get(p);
        if (!depSet?.has(activeEffect)) {
          depSet!.add(activeEffect)
        }
        activeEffect = null
      }
      return Reflect.get(target, p, receiver)
    },
    set(target, p, v, receiver): boolean {
      // tragger
      if (dep.has(target) && dep.get(target)?.has(p)) {
        for (let effectFn of dep.get(target)!.get(p)!) {
          effectFn && effectFn()
        }
      }
      return false
    }
  })
}


function effect(effectFn: EffectFn) {
  activeEffect = effectFn
  effectFn && effectFn()
}

export default effect;