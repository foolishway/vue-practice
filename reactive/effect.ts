export type EffectFn = (() => void) & {dep: Array<Set<EffectFn>>} | null
let activeEffect: EffectFn = null;
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
        let depSet = depMap!.get(p)
        if (!depSet?.has(activeEffect)) {
          depSet!.add(activeEffect)
        }
        if (!activeEffect.dep) activeEffect.dep = []
        activeEffect.dep.push(depSet!)
      }
      return Reflect.get(target, p, receiver)
    },
    set(target, p, v, receiver): boolean {
      let result = Reflect.set(target, p, v, receiver)
      // trigger
      if (dep.has(target) && dep.get(target)?.has(p)) {
        let effectsToRun = new Set<EffectFn>()
        dep.get(target)!.get(p)!.forEach(effectFn => {
          effectsToRun.add(effectFn)
        })

        effectsToRun.forEach(effectFn => {
          if (effectFn !== activeEffect){
            effectFn && effectFn()
          }
        })
      }
      return result
    }
  })
}


function effect(effectFn: () => void) {
  const wrapperFn = () => {
    // cleanup
    cleanup(wrapperFn)
    activeEffect = wrapperFn as EffectFn
    effectFn && effectFn()
    activeEffect = null
  }
  wrapperFn();
  return wrapperFn as EffectFn
}

function cleanup(wrapperFn) {
  wrapperFn.dep?.forEach((set) => {
    if (set.has(wrapperFn)) {
      set.delete(wrapperFn)
    }
  })
  if (wrapperFn.dep)
    wrapperFn.dep.length = 0
}

export default effect;