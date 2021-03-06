import {dependencyMatch, getWithPath, ensureStrictPath} from './utils'

class DependencyTracker {
  constructor (computed) {
    this.propsTrackMap = {}
    this.stateTrackMap = {}
    this.propsTrackFlatMap = {}
    this.stateTrackFlatMap = {}
    this.computed = computed
    this.value = null
  }

  run (stateGetter, props) {
    const newStateTrackMap = {}
    const newPropsTrackMap = {}
    const newPropsTrackFlatMap = {}
    const newStateTrackFlatMap = {}
    const stateTrackFlatMap = this.stateTrackFlatMap
    const propsTrackFlatMap = this.propsTrackFlatMap
    const propsGetter = getWithPath(props)
    let hasChanged = false

    function setTrackMap (path, newTrackMap) {
      const pathArray = path.split('.')
      pathArray.reduce((currentNewTrackMapLevel, key, index) => {
        if (!currentNewTrackMapLevel[key]) {
          hasChanged = true
          currentNewTrackMapLevel[key] = {}
        }

        if (index < pathArray.length - 1) {
          currentNewTrackMapLevel[key].children = currentNewTrackMapLevel[key].children || {}
        }

        return currentNewTrackMapLevel[key].children
      }, newTrackMap)
    }

    this.value = this.computed.getValue({
      state (path) {
        const value = stateGetter(path)
        const strictPath = ensureStrictPath(path, value)

        newStateTrackFlatMap[strictPath] = true

        if (!stateTrackFlatMap[strictPath]) hasChanged = true
        setTrackMap(strictPath, newStateTrackMap)

        return value
      },
      props (path) {
        newPropsTrackFlatMap[path] = true

        if (!propsTrackFlatMap[path]) hasChanged = true
        setTrackMap(path, newPropsTrackMap)

        return propsGetter(path)
      }
    })

    this.stateTrackMap = newStateTrackMap
    this.propsTrackMap = newPropsTrackMap
    this.stateTrackFlatMap = newStateTrackFlatMap
    this.propsTrackFlatMap = newPropsTrackFlatMap

    return hasChanged
  }

  match (stateChanges, propsChanges) {
    return (
      Boolean(dependencyMatch(stateChanges, this.stateTrackMap).length) ||
      Boolean(dependencyMatch(propsChanges, this.propsTrackMap).length)
    )
  }
}

export default DependencyTracker
