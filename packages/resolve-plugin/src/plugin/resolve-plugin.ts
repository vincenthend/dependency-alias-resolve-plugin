import webpack from 'webpack'
import fs from 'fs'
import path from 'path'

export class AliasResolvePlugin implements webpack.ResolvePluginInstance {
    private cache: Map<string, string[]>

    constructor() {
        this.cache = new Map()
    }

    apply(resolver: webpack.Resolver) {
        const target = resolver.ensureHook('relative')
        const resolve = resolveAsPromise(resolver)

        resolver.getHook('describedResolve').tapAsync(AliasResolvePlugin.name, async (request, context, callback) => {
            if(request.descriptionFilePath && !this.cache.has(request.descriptionFilePath)) {
                const projDir = path.dirname(request.descriptionFilePath)
                const resolveFile = path.join(projDir, 'webpack.resolve.js')
                if(fs.existsSync(resolveFile)) {
                    const resolveModules = require(path.join(projDir, 'webpack.resolve.js'))
                    this.cache.set(request.descriptionFilePath, resolveModules.resolve)
                } else {
                    this.cache.set(request.descriptionFilePath, null)
                }
            }

            const resolveModules = this.cache.get(request.descriptionFilePath)
            if(resolveModules) {
                for (const resolveModule of resolveModules) {
                    const resolvedFile = await resolve(target, {
                        ...request,
                        path: path.join(resolveModule, request.request),
                        request: ''
                    }, `resolving to ${resolveModule}`, context)

                    if(resolvedFile) {
                        return callback(null, resolvedFile)
                    }
                }
            }
            
            callback()
        })
    }
}

function resolveAsPromise(resolver: webpack.Resolver): typeof webpack.Resolver.prototype.doResolve {
    return (target, request, log, context) =>  new Promise<void>((resolve, reject) => {
        resolver.doResolve(target, request, log, context, (err, result) => {
            if (err) {
                return reject()
            } else {
                resolve(result)
            }
        })
    })
}