var controllerModule = {
    /**
     * 频次控制模块
     */
    frequenceController : new core.FrequenceController(PAGE_HASH),

    /**
     * 顺序控制模块
     */
    orderController : new core.OrderController(PAGE_MEDIA_ORDER, {
        timeout : PAGE_MEDIA_DONE_TIMEOUT
    })
};