<template>
    <div class="userLayout">
        <div class="container">
            <div class="top">
                <div class="header">
                    <a-badge>
                        <a href="/">
                            <img src="@/assets/image/common/logo-csg-h.png" class="logo" alt="logo">
                            <span class="title">智能电网二次规划设计项目管理工具</span>
                        </a>
                    </a-badge>
                </div>
                <!-- <div class="desc">{{desc}}</div> -->
            </div>

            <router-view/>
            <slot></slot>

            <div class="footer">
                <div class="copyright">
                    Copyright &copy; 2020
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'UserLayout',
        props: {
            desc: {
                type: [String],
                default() {
                    return '欢迎使用智能电网二次规划设计项目管理工具';
                }
            }
        }
    }
</script>

<style lang="less">
    .userLayout {
        height: 100%;
        overflow: auto;

        &.mobile {
            .container {
                .main {
                    max-width: 368px;
                    width: 98%;
                }
            }
        }

        .container {
            width: 100%;
            min-height: 100%;
            background: #fff url(~@/assets/image/common/background.svg) no-repeat 50%;
            background-size: 100%;
            padding: 110px 0 144px;
            position: relative;

            a {
                text-decoration: none;
            }

            .top {
                text-align: center;

                .header {
                    // height: 44px;
                    line-height: 44px;

                    .badge {
                        position: absolute;
                        display: inline-block;
                        line-height: 1;
                        vertical-align: middle;
                        margin-left: -12px;
                        margin-top: -10px;
                        opacity: 0.8;
                    }

                    .logo {
                        // height: 44px;
                        // vertical-align: top;
                        // margin-right: 12px;
                        display: block;
                        margin: 0 auto;
                        // border-style: none;
                        /*transform: rotate(-25deg);*/
                        /*-ms-transform: rotate(-25deg); !* IE 9 *!*/
                        /*-moz-transform: rotate(-25deg); !* Firefox *!*/
                        /*-webkit-transform: rotate(-25deg); !* Safari 和 Chrome *!*/
                        /*-o-transform: rotate(-25deg);*/
                    }

                    .title {
                        font-size: 28px;
                        color: rgba(0, 0, 0, .85);
                        font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        font-weight: 600;
                        position: relative;
                        top: 2px;
                    }
                }

                .desc {
                    font-size: 14px;
                    color: rgba(0, 0, 0, 0.45);
                    margin-top: 12px;
                    margin-bottom: 40px;
                }
            }

            .main {
                min-width: 260px;
                width: 368px;
                margin: 0 auto;
            }

            .footer {
                position: absolute;
                width: 100%;
                bottom: 0;
                padding: 0 16px;
                margin: 48px 0 24px;
                text-align: center;

                .links {
                    margin-bottom: 8px;
                    font-size: 14px;

                    a {
                        color: rgba(0, 0, 0, 0.45);
                        transition: all 0.3s;

                        &:not(:last-child) {
                            margin-right: 40px;
                        }
                    }
                }

                .copyright {
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 14px;
                }
            }
        }
    }
</style>
