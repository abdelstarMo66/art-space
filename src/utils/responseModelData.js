
exports.artistData = (artist) => {
    return {
        id: artist._id,
        name: artist.name,
        email: artist.email,
        phone: artist.phone,
        imageId: artist.profileImg.public_id,
        profileImg: artist.profileImg.secure_url ?? null,
        gender: artist.gender ?? null,
        accountActive: artist.accountActive,
        addresses: artist.addresses.map(address => {
            return {
                alias: address.alias,
                street: address.street,
                region: address.region,
                city: address.city,
                country: address.country,
                postalCode: address.postalCode ?? null,
                phone: address.phone ?? null,
            }
        }),
    }
}

exports.allArtistData = (artists) => {
    return artists.map(artist => {
        return {
            id: artist._id,
            name: artist.name,
            email: artist.email,
            phone: artist.phone,
            gender: artist.gender ?? null,
            accountActive: artist.accountActive,
            addresses: artist.addresses.map(address => {
                return {
                    alias: address.alias,
                    street: address.street,
                    region: address.region,
                    city: address.city,
                    country: address.country,
                    postalCode: address.postalCode ?? null,
                    phone: address.phone ?? null,
                }
            }),
        }
    });
}

exports.userData = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        imageId: user.profileImg.public_id,
        profileImg: user.profileImg.secure_url ?? null,
        gender: user.gender ?? null,
        accountActive: user.accountActive,
        addresses: user.addresses.map(address => {
            return {
                alias: address.alias,
                street: address.street,
                region: address.region,
                city: address.city,
                country: address.country,
                postalCode: address.postalCode ?? null,
                phone: address.phone ?? null,
            }
        }),
    }
}

exports.allUserData = (users) => {
    return users.map(user => {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender ?? null,
            accountActive: user.accountActive,
            addresses: user.addresses.map(address => {
                return {
                    alias: address.alias,
                    street: address.street,
                    region: address.region,
                    city: address.city,
                    country: address.country,
                    postalCode: address.postalCode ?? null,
                    phone: address.phone ?? null,
                }
            }),
        }
    });
}

exports.allAddresses = (addresses) => {
    return addresses.map(address => {
        return {
            alias: address.alias,
            street: address.street,
            region: address.region,
            city: address.city,
            country: address.country,
            postalCode: address.postalCode ?? null,
            phone: address.phone ?? null,
        }
    })
}

exports.adminData = (admin) => {
    return {
        id: admin._id,
        nid: admin.nid,
        name: admin.name,
        userName: admin.username,
        phone: admin.phone,
        imageId: admin.profileImg.public_id,
        profileImg: admin.profileImg.secure_url ?? null,
        gender: admin.gender ?? null,
        role: admin.role,
    }
}

exports.allAdminData = (admins) => {
    return admins.map(admin => {
        return {
            id: admin._id,
            nid: admin.nid,
            name: admin.name,
            userName: admin.username,
            phone: admin.phone,
            gender: admin.gender ?? null,
            role: admin.role,
        }
    });
}

exports.allProductData = (products) => {
    return products.map((product) => {
        return {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            isAvailable: product.isAvailable,
            owner: {
                id: product.owner._id,
                name: product.owner.name,
            },
            category: product.category.title,
            style: product.style.title,
            subject: product.subject.title,
            size: `${product.height}h * ${product.width}w * ${product.depth}d`,
            coverImage: {
                imageId: product.coverImage.public_id,
                profileImg: product.coverImage.secure_url ?? null,
            },
            material: product.material ?? null,
        }
    })
}

exports.productData = (product) => {
    return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        isAvailable: product.isAvailable,
        owner: {
            id: product.owner._id,
            name: product.owner.name,
        },
        category: product.category.title,
        style: product.style.title,
        subject: product.subject.title,
        size: `${product.height}h * ${product.width}w * ${product.depth}d`,
        coverImage: {
            imageId: product.coverImage.public_id,
            profileImg: product.coverImage.secure_url ?? null,
        },
        images: product.images.map(image => {
            return {
                imageId: image.public_id,
                profileImg: image.secure_url ?? null,
            }
        }),
        material: product.material ?? null,
    }
}

exports.eventData = (event) => {
    return {
        title: event.title,
        description: event.description,
        owner: {
            id: event.owner._id,
            name: event.owner.name,
        },
        duration: event.duration,
        began: event.began,
        end: event.end,
        products: event.products.map(product => {
            return {
                id: product._id,
                title: product.title,
                price: product.price,
                owner: {
                    id: product.owner._id,
                    name: product.owner.name,
                },
            }
        }),
    }
}

exports.allEventData = (events) => {
    return events.map(event => {
        return {
            title: event.title,
            description: event.description,
            owner: {
                id: event.owner._id,
                name: event.owner.name,
            },
            duration: event.duration,
            began: event.began,
            end: event.end,
        }
    });
}

exports.allProductInEventData = (products) => {
    return products.map((product) => {
        return {
            id: product._id,
            title: product.title,
            description: product.description,
            price: product.price,
            isAvailable: product.isAvailable,
            owner: {
                id: product.owner._id,
                name: product.owner.name,
            },
            category: product.category.title,
            style: product.style.title,
            subject: product.subject.title,
            size: `${product.height}h * ${product.width}w * ${product.depth}d`,
            coverImage: {
                imageId: product.coverImage.public_id,
                profileImg: product.coverImage.secure_url ?? null,
            },
            images: product.images.map(image => {
                return {
                    imageId: image.public_id,
                    profileImg: image.secure_url ?? null,
                }
            }),
            material: product.material ?? null,
        }
    })
}

exports.productInEventData = (product) => {
    return {
        id: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        isAvailable: product.isAvailable,
        owner: {
            id: product.owner._id,
            name: product.owner.name,
        },
        category: product.category.title,
        style: product.style.title,
        subject: product.subject.title,
        size: `${product.height}h * ${product.width}w * ${product.depth}d`,
        coverImage: {
            imageId: product.coverImage.public_id,
            profileImg: product.coverImage.secure_url ?? null,
        },
        images: product.images.map(image => {
            return {
                imageId: image.public_id,
                profileImg: image.secure_url ?? null,
            }
        }),
        material: product.material ?? null,
    }
}

exports.searchData = (artists, products, events) => {
    return {
        resultCount: artists.length + products.length + events.length,
        products: products.map((product) => {
            return {
                id: product._id,
                title: product.title,
                description: product.description,
                price: product.price,
                isAvailable: product.isAvailable,
                owner: {
                    id: product.owner._id,
                    name: product.owner.name,
                },
                coverImage: {
                    imageId: product.coverImage.public_id,
                    profileImg: product.coverImage.secure_url ?? null,
                },
            }
        }),
        artists: artists.map(artist => {
            return {
                id: artist._id,
                name: artist.name,
                email: artist.email,
                phone: artist.phone,
                gender: artist.gender ?? null,
                accountActive: artist.accountActive,
                addresses: artist.addresses.map(address => {
                    return {
                        alias: address.alias,
                        street: address.street,
                        region: address.region,
                        city: address.city,
                        country: address.country,
                        postalCode: address.postalCode ?? null,
                        phone: address.phone ?? null,
                    }
                }),
            }
        }),
        events: events.map(event => {
            return {
                title: event.title,
                description: event.description,
                owner: {
                    id: event.owner._id,
                    name: event.owner.name,
                },
                duration: event.duration,
                began: event.began,
                end: event.end,
            }
        }),
    }
}

exports.cartData = (cart) => {
    return {
        itemCount: cart.cartItems.length,
        user: {
            id: cart.user._id,
            name: cart.user.name,
        },
        totalCartPrice: cart.totalCartPrice,
        cartItems: cart.cartItems.map(item => {
            return {
                product: {
                    id: item.product._id,
                    title: item.product.title,
                    description: item.product.description,
                    price: item.product.price,
                    owner: {
                        id: item.product.owner._id,
                        name: item.product.owner.name,
                    },
                    category: item.product.category.title,
                    style: item.product.style.title,
                    subject: item.product.subject.title,
                    size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                    coverImage: {
                        imageId: item.product.coverImage.public_id,
                        profileImg: item.product.coverImage.secure_url ?? null,
                    },
                    material: item.product.material ?? null,
                },
                price: item.price
            }
        }),
    }
}

exports.orderData = (order) => {
    return {
        user: {
            id: order.user._id,
            name: order.user.name,
        },
        shippingAddress: {
            alias: order.shippingAddress.alias,
            street: order.shippingAddress.street,
            region: order.shippingAddress.region,
            city: order.shippingAddress.city,
            country: order.shippingAddress.country,
            postalCode: order.shippingAddress.postalCode ?? null,
            phone: order.shippingAddress.phone ?? null,
        },
        cartItems: order.cartItems.map(item => {
            return {
                product: {
                    id: item.product._id,
                    title: item.product.title,
                    description: item.product.description,
                    price: item.product.price,
                    owner: {
                        id: item.product.owner._id,
                        name: item.product.owner.name,
                    },
                    category: item.product.category.title,
                    style: item.product.style.title,
                    subject: item.product.subject.title,
                    size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                    coverImage: {
                        imageId: item.product.coverImage.public_id,
                        profileImg: item.product.coverImage.secure_url ?? null,
                    },
                    material: item.product.material ?? null,
                },
                price: item.price
            }
        }),
        totalOrderPrice: order.totalOrderPrice,
        paymentMethodType: order.paymentMethodType,
        currency: order.currency,
        isPaid: order.isPaid,
        paidAt: order.paidAt ?? null,
        orderState: order.orderState,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt ?? null,
    }
}

exports.allOrderData = (orders) => {
    return orders.map((order) => {
        return {
            user: {
                id: order.user._id,
                name: order.user.name,
            },
            shippingAddress: {
                alias: order.shippingAddress.alias,
                street: order.shippingAddress.street,
                region: order.shippingAddress.region,
                city: order.shippingAddress.city,
                country: order.shippingAddress.country,
                postalCode: order.shippingAddress.postalCode ?? null,
                phone: order.shippingAddress.phone ?? null,
            },
            cartItems: order.cartItems.map(item => {
                return {
                    product: {
                        id: item.product._id,
                        title: item.product.title,
                        description: item.product.description,
                        price: item.product.price,
                        owner: {
                            id: item.product.owner._id,
                            name: item.product.owner.name,
                        },
                        category: item.product.category.title,
                        style: item.product.style.title,
                        subject: item.product.subject.title,
                        size: `${item.product.height}h * ${item.product.width}w * ${item.product.depth}d`,
                        coverImage: {
                            imageId: item.product.coverImage.public_id,
                            profileImg: item.product.coverImage.secure_url ?? null,
                        },
                        material: item.product.material ?? null,
                    },
                    price: item.price
                }
            }),
            totalOrderPrice: order.totalOrderPrice,
            paymentMethodType: order.paymentMethodType,
            currency: order.currency,
            isPaid: order.isPaid,
            paidAt: order.paidAt ?? null,
            orderState: order.orderState,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt ?? null,
        }
    })
}