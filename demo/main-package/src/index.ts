import { foo } from 'dependency-package'
import { foobar } from 'src/foo'

export function baz() {
    foo()
    foobar()
    console.log('baz')
}

baz()